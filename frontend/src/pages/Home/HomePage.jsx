import Hero from "../../components/Hero/Hero"
import EmergencySection from "../../components/Home/EmergencySection"
import Impact from "../../components/Impact/Impact"
import Footer from "../../components/layout/Footer"
import Navbar from "../../components/layout/Navbar/Navbar"
import Steps from "../../components/Steps/Steps"

const HomePage = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <EmergencySection />
            <Steps />
            <Impact />
            <Footer />
        </>
    )
}

export default HomePage;