function ErrorPage() {
    return (
        <div id="Error Content" className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center text-center p-4 overflow-hidden">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 text-black">Sorry, this page is not available</h1>
                <div className="flex">
                    <p className="text-xl text-black">The link you followed may be broken, or the page may have been removed.</p>
                    <a className="text-xl ml-1" href="/">Go back to Tessera.</a>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage