import SideNav from '@/components/SideNav'

const page = () => {

    return (
        <>
            <div className="flex h-screen">
                <SideNav />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-x-hidden overflow-y-auto pl-8">
                        <div className="container mx-auto py-6">
                            <p>Overview</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
