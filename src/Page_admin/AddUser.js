import '../style.css';
import React ,{useState} from 'react';

function AddUser() {
  const [name ,setName] = useState('')
  const [email ,setEmail] = useState('')
  const [isAdmin ,setIsAdmin] = useState(0)

  async function handleAddUser() {
    try {
      await fetch('http://localhost:4000/admin/addUser',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email: email,
          isAdmin: isAdmin
        })        
      })
    } catch (error) {
      console.error(error);      
    }
  }
    return (
        <div className='mx-5 my-5 w-full h-screen'>
        <div className='flex flex-col items-center justify-center'>
          <p className='text-3xl font-bold p-5 ' >บัญชีผู้ใช้งาน</p>
  
          <form className="bg-from-color p-8  w-9/12 rounded-lg h-90 text-xl" onSubmit={handleAddUser}>
          <div className='items-center justify-center'>
              <div className='flex pt-2 pb-1'>
                <p>ชื่อ</p>
              </div>
              <div className='flex items-center justify-center'>
                <input placeholder='กรุณากรอกชื่อ-สกุล' className='w-9/12 p-2 rounded' id='name' type='text' onChange={(event) => setName(event.target.value)} />
              </div>
              <div className='flex pt-2 pb-1'>
                <p>อีเมล</p>
              </div>
              <div className='flex items-center justify-center'>
                <input placeholder='กรุณากรอกอีเมล ตัวอย่าง sophie@example.com' className='w-9/12 p-2 rounded' id='name' type="email" onChange={(event) => setEmail(event.target.value)} />
              </div>
              <diV className='flex pt-2 pb-1'>
                <p>สถานะ</p>
              </diV>
              <div className='flex items-center justify-center border-2 border-button-color border-dashed rounded-lg p-2'>
                <div className="radio-inputs">
                  
                  <label className="radio">
                    <input type="radio" name="radio" value={0} onChange={(event) => setIsAdmin(event.target.value)} />
                      <span className="name">อาจารย์</span>
                  </label>
  
                  <label className="radio">
                    <input type="radio" name="radio" value={1} onChange={(event) => setIsAdmin(event.target.value)} />
                      <span className="name">แอดมิน</span>
                  </label>
                </div>
              </div>
            </div>
            <div className='flex py-3 w-9/12 rounded-lg text-xl justify-end items-center'>
              <button
                className='bg-yes-color p-2 rounded-lg text-white w-1/5 ml-2 drop-shadow-md hover:bg-green-900 active:bg-neutral-800' type='submit'>
                ตกลง
              </button>
              <button
                className='bg-no-color p-2 rounded-lg text-white w-1/5 ml-2 drop-shadow-md hover:bg-red-900 active:bg-neutral-800' type='reset'>
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default AddUser;