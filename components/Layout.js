import Nav from './Nav'


export default function Layout({ children }) {

    return (
        <div>
            <Nav />
            <main className='px-10 font-poppins'>{children}</main>
        </div>
    )

}