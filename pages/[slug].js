import Message from "../components/Message"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { auth, db } from '../utils/firebase'
import { toast } from "react-toastify"
import Image from "next/image"
import { arrayUnion, Timestamp, updateDoc, doc, getDoc, onSnapshot } from "firebase/firestore"


export default function PostDetails() {

    const router = useRouter()
    const routeData = router.query
    const [message, setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])

    // Submit a message
    const submitMessage = async () => {
        // Check if user is logged in
        if(!auth.currentUser) return router.push('/auth/login')

        if(!message) {
            toast.error('Don\'t leave an empty message', { position: toast.POSITION.TOP_CENTER, autoClose: 1500 })
        }

        const docRef = doc(db, 'posts', routeData.id)
        await updateDoc(docRef, {
            comments: arrayUnion({ 
                message,
                avatar: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                timestamp: Timestamp.now()
             })
        })

        toast.success('Comment has been added', { position: toast.POSITION.TOP_CENTER, autoClose: 1500 })
        setMessage('')
    }

    const getComments = async () => {

        const docRef = doc(db, 'posts', routeData.id)
        const unsubscribe = onSnapshot(docRef, snapshot => {
            setAllMessages(snapshot.data().comments) 
        })

        return unsubscribe

    }

    useEffect(() => {
        if(!router.isReady) return
        getComments()
    }, [router.isReady])

    return (
        <div>
            <Message {...routeData}>
                <div className="my-4">
                    <div className="flex">
                        <input className="bg-gray-800 w-full p-2 text-white text-sm" type='text' value={message} placeholder={'Send a message'} onChange={e => setMessage(e.target.value)} />
                        <button className="bg-cyan-500 text-white py-2 px-4 text-sm" onClick={submitMessage}>Submit</button>
                    </div>
                    <div className="py-6">
                        <h2 className="font-bold">Comments</h2>
                        {allMessages?.map(message => (
                            <div className="bg-white p-4 my-4 border-2" key={message.timestamp}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Image className="w-10 rounded-full" src={message.avatar} width='75' height='75' alt='user' />
                                    <h2 className="font-bold">{message.username}</h2>
                                </div>
                                <h2>{message.message}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </Message>
        </div>
    )
}