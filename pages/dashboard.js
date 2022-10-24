import Head from 'next/head'
import { auth } from '../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { useState, useEffect  } from 'react'


export default function Dashboard() {

    const route = useRouter()
    const [user, loading] = useAuthState(auth)

    // See if user is loggded
    const getData = async () => {
        if(loading) return
        if(!user) route.push('/auth/login')    
    }

    useEffect(() => {
        getData()
    }, [user, loading])

    return (
        <>
            <Head>
                <title>Dashboard - Creative Thoughts</title>
            </Head>
            <div>
                <h1>You posts</h1>
                <div>
                    posts
                </div>
                <button onClick={() => auth.signOut()}>Sign out</button>
            </div>
        </>
        
    )

}