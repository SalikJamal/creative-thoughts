import Head from 'next/head'
import { auth, db } from '../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'

export default function Post() {
    
    const route = useRouter()
    const [user, loading] = useAuthState(auth)
    const [post, setPost] = useState({ description: '' })

    const updateData = route.query

    // Submit Post
    const submitPost = async (e) => {
        e.preventDefault()

        // Run checks for description
        if(!post.description) {
            toast.error('Description field empty', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
            })
            return
        }

        if(post.description.length > 300) {
            toast.error('Description too long', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
            })
            return
        }

        // Make a new post
        const collectionRef = collection(db, 'posts')
        await addDoc(collectionRef, {
            ...post,
            timestamp: serverTimestamp(),
            user: user.uid,
            avatar: user.photoURL,
            username: user.displayName
        })

        setPost({ description: '' })

        return route.push('/')
    }

    // Check our user
    const checkUser = async () => {

        if(loading) return
        if(!user) route.push('/auth/login')

        if(updateData.id) {
            setPost(updateData)
        }

    }

    useEffect(() => {
        checkUser()
    }, [user, loading])


    return (
        <>
            <Head>
                <title>Create a Post - Creative Thoughts</title>
                {updateData.id && <title>Edit Post - Creative Thoughts</title>}
            </Head>
            <div className='my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto'>
                <form onSubmit={submitPost}>
                    {updateData.id ? <h1 className='text-2xl font-bold'>Edit post</h1>
                    : <h1 className='text-2xl font-bold'>Create a new post</h1>}
                    <div className='py-2'>
                        <h3 className='text-lg font-medium py-2'>Description</h3>
                        <textarea className='bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm' value={post.description} onChange={e => setPost({...post, description: e.target.value})}></textarea>
                        <p className={`text-cyan-600 font-medium text-sm ${post.description.length > 300 ? 'text-red-600' : ''}`}>{post.description.length}/300</p>
                    </div>
                    <button className='w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm' type='submit'>Submit</button>
                </form>
            </div>
        </>
        
    )

}