import { useNavigate } from "react-router-dom";
import image from '../pic/eng.jpg'
import imageGoogle from '../pic/google.png'
import '../style.css';
function Login (){
    const navigate = useNavigate();
    const isLogin = () => {
        navigate("/FirstPage")
    }
    return(
        <div style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${image})`, // ใส่ linear gradient เพื่อทำให้รูปพื้นหลังสีจางลง
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '100vh',
          }} className="flex flex-col">
            <div className="flex text-red-900">
                <div className="text-8xl p-3">KU</div>
                <div className=" p-3">
                    <div className="text-6xl">src</div>
                    <div className="text-2xl">Course Schedule</div>
                </div>
            </div>
            <diV className="flex justify-center h-screen items-center text-2xl">
                    <button className="flex h-1/5  justify-center rounded-2xl bg-white w-3/5 items-center active:bg-red-900 hover:bg-from-color" type="button" onClick={isLogin}>
                        <p className="pr-3 font-bold">SIGN IN WITH </p>
                        <img src={imageGoogle} className="w-32 pl-3" alt="รูปภาพ" /> 
                    </button>
            </diV>
        </div>
    )
}
export default Login