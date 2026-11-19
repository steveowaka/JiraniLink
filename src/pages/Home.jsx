import { useState } from "react";   

function Home(){

    const [searchTerm, setSearchTerm] = useState("")

    const categories = [
        "Plumbers",
        "Tutors",
        "BabySiters",
        "Mechanics"
    ]

    function handleSearch(e){
        e.preventDefault()

        if(!searchTerm.trim()){
            return 
        }


    }

    return(
        <main className="min-h-[calc(100vh-80px)] bg-[#ECFDF3] flex items-center justify-center px-5">

            <section className="w-full max-w-5xl mx-auto text-center">

                <h1 className = "text-[36px] md:text-[56px] font-bold text-[#1F2937] leading-tight">Find Trusted Local Provider</h1>

                <p className = "mt-3 text-lg md:text-[22px] text-[#566273]"> Plumbers, tutors, babysitters and more in your area.</p>

                <form onSubmit = {handleSearch} className="mt-9 w-full max-w-[860px] mx-auto flex flex-col sm:flex-row gap-4">
                    
                    <input type = "text"
                     placeholder = "search by service or location"
                     value = {searchTerm}
                     onChange = {(e) => setSearchTerm(e.target.value)}
                     className="flex-1 min-w-0 h-15 px-5 bg-white border-2 border-[#A1AAB5] rounded-xl text-lg text-gray-800 outline-none focus:border-green-700"
                    />

                    <button type="submit" className="h-15 px-10 bg-[#15803D] text-white text-lg font-semibold rounded-xl hover:bg-green-800 transition-colors">Search</button>
                
                </form>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <button
                        key={category}
                        type="button"
                        onClick={() => setSearchTerm(category)}
                         className="px-6 py-3 border-2 border-[#15803D] rounded-full text-[#15803D] text-lg font-semibold hover:bg-[#15803D] hover:text-white transition-colors"
                        >{category}</button>
                    ))}
                </div>

            </section>
        </main>
    )
}

export default Home;