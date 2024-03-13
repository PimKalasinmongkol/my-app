import React, { useState, useEffect } from "react";
import * as XLXS from "xlsx";
import axios from "axios";

function ImportSubject() {
    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [years, setYears] = useState([]);
    const [select_year, setSeleYselect_year] = useState([]);
    const [subject_nameTH, setSubject_nameTH] = useState("");
    const [subject_nameEN, setSubject_nameEN] = useState("");
    const [credit, setCredit] = useState(0);
    const [subject_id, setSubject_id] = useState("");
    const [type, setType] = useState("");
    const [courseData, setCourseData] = useState([]);
    const [filteredCourseData, setFilteredCourseData] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลที่ถูกกรอง
    const [filterValue, setFilterValue] = useState(""); // เพิ่ม state เพื่อใช้ในการกรองข้อมูล
    const [selectedItems_open, setSelectedItems_open] = useState({});
    const [selectedItems_delete, setSelectedItems_delete] = useState({});
    const [buttonText_open, setButtonText_open] = useState("เลือกทั้งหมด");
    const [buttonText_delete, setButtonText_delete] = useState("เลือกทั้งหมด");

  ////////////////////open/////////////////////
  const handleCheckboxChange_open = (id) => {
    setSelectedItems_open({
      ...selectedItems_open,
      [id]: !selectedItems_open[id],
    });
  };

  const handleCheckboxChange_open_unChecked = (id) => {
      const updatedItems = { ...selectedItems_open };
      delete updatedItems[id]; 
      setSelectedItems_open(updatedItems);
  };

  const handleCheckAll_open = () => {
    const allSelected_open = {}; // Object to store selected state for all items
    const allSelected = Object.values(selectedItems_open).every(
      (value) => value
    ); // Check if all items are currently selected

    // If all items are currently selected, deselect all; otherwise, select all
    filteredCourseData.forEach((item) => {
      allSelected_open[item.subject_id] = !allSelected;
    });

    // Update selectedItems_open state with allSelected_open
    setSelectedItems_open(allSelected_open);

    if (allSelected) {
      setButtonText_open("เลือกทั้งหมด");
    } else {
      setButtonText_open("ยกเลิกทั้งหมด");
    }
  };

  const handleOpen = async (event) => {
    event.preventDefault();
    try {
      await Promise.all(
        Object.entries(selectedItems_open)
          .filter(([key, value]) => value) 
          .map(async ([key, value]) => {
            const response = await fetch(`http://localhost:4000/course/isEnableCourse/${key}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
              throw new Error(`Failed to delete item with ID: ${key}`);
            }
          })
      );
      
      console.log("Selected items set enable successfully");
    } catch (error) {
      console.error("Error set enable selected items:", error);
    }
  };

    ///////////////////delete/////////////////
    const handleCheckboxChange_delete = (id) => {
        setSelectedItems_delete({
            ...selectedItems_delete,
            [id]: !selectedItems_delete[id]
        });
    };

    const handleCheckboxChange_delete_unChecked = (id) => {
        const updatedItems = { ...selectedItems_delete };
        delete updatedItems[id]; 
        setSelectedItems_delete(updatedItems);
    };

    const handleCheckAll_delete = () => {
        const allSelected_delete = {};
        const allSelected = Object.values(selectedItems_delete).every(value => value);

        filteredCourseData.forEach(item => {
            allSelected_delete[item.subject_id] = !allSelected;
        });

        setSelectedItems_delete(allSelected_delete);

        if (allSelected) {
            setButtonText_delete("เลือกทั้งหมด");
        } else {
            setButtonText_delete("ยกเลิกทั้งหมด");
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {

        await Promise.all(
            Object.entries(selectedItems_delete)
            .filter(([key, value]) => value) 
            .map(async ([key, value]) => {
                const response = await fetch(`http://localhost:4000/course/deleteCourse/${key}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) {
                throw new Error(`Failed to delete item with ID: ${key}`);
                }
            })
        );
        
        console.log("Selected items deleted successfully");
        } catch (error) {
        console.error("Error deleting selected items:", error);
        }
    };

    async function handleImportCourse() {
        try {
        await fetch("http://localhost:4000/course/importCourse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            subject_id: subject_id,
            subject_nameEN: subject_nameEN,
            subject_nameTH: subject_nameTH,
            credit: credit,
            type: type,
            school_year: selectedYear,
            }),
        });
        } catch (e) {
        console.error(e);
        }
    }

    /* async function handleUplodefile() {
        const formDataWithYear = data.map((item) => ({
        ...item,
        school_year: selectedYear,
        }));
        console.log(formDataWithYear);
        try {
        await fetch("http://localhost:4000/course/importFromExcel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formDataWithYear),
        });
        } catch (e) {
        console.error(e);
        }
    }*/
    ////http://localhost:4000/course/importFromExcel
    
    const handleUplodefile = async (e) => {
        e.preventDefault();
        const formDataWithYear = data.map(item => ({
        ...item,
        school_year: selectedYear
        }));
        console.log(formDataWithYear)
        formDataWithYear.map(async(item) => {
        try {
            const response = await axios.post('http://localhost:4000/course/importFromExcel', item);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        })
    };

    useEffect(() => {
        (async function () {
        const res = await fetch("http://localhost:4000/course/getAllCourses");
        const data = await res.json();
        setCourseData(data);
        })();
    }, [courseData]);

    useEffect(() => {
        const currentYear = new Date().getFullYear() + 543;
        const yearOptions = ["กรุณาเลือกปีหลักสูตร"];

        for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        if (i % 5 === 0 || i % 5 === 5) {
            yearOptions.push(i);
        }
        }

        setYears(yearOptions);
        setSelectedYear(currentYear);
    }, []);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    useEffect(() => {
        const filteredData = courseData.filter((item) => {
        if (item.subject_id !== null && item.subject_id !== undefined) {
            return (
            item.subject_id.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
            item.subject_nameEN.toLowerCase().includes(filterValue.toLowerCase()) ||
            item.subject_nameTH.toLowerCase().includes(filterValue.toLowerCase())||
            item.school_year.toLowerCase().includes(filterValue.toLowerCase()) 
            );
        } else {
            return false; 
        }
        });

        setFilteredCourseData(filteredData);
    }, [filterValue, courseData]);

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
    };

    const handleFileUpload = (e) => {
        setData([]);
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);

        reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLXS.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLXS.utils.sheet_to_json(sheet);
        setData(parsedData);
        };
        
    };

  return (
    <div className="w-full mx-5 my-5">
      <div className="flex text-3xl font-bold">
        <p>นำเข้าหลักสูตร</p>
      </div>
      <div className="flex flex-row justify-between pt-5 h-90">
        <form
          className="bg-from-color p-2 m-2 w-3/5 rounded-lg h-90 text-base"
          onSubmit={handleUplodefile}
        >
          <div className="flex flex-col justify-center h-90">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center justify-between w-3/5 bg-white rounded-full  p-1 m-1">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="rounded-full pl-1 text-sm py-1.5 w-3/4"
                  placeholder="ไฟล์หลักสูตรปีการศึกษา"
                ></input>
              </div>

              <div className="flex flex-row justify-end items-center  w-2/5">
                <p className="p-2">ปีหลักสูตร</p>
                <div className="flex items-center justify-between w-3/5 bg-white rounded-full  p-2 m-1">
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="rounded-full pl-1 text-sm py-1.5 w-full "
                    name="year"
                    id="year"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <form className="bg-white flex m-2 p-2 rounded h-72">
              {data.length > 0 && (
                <table className="table-auto">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index}>
                      {Object.values(row).map((value, index) => (
                        <td key={index}>{value}</td>
                      ))}
                    </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </form>
          </div>
          <div className="flex justify-end pt-2 pr-3">
            <button
              type="submit"
              className="bg-rose-color font-semibold text-white m-1 p-1 rounded-full w-1/4 hover:bg-red-900 active:bg-neutral-800"
            >
              อัพโหลด
            </button>
          </div>
        </form>
        <form
          className="bg-from-color p-2 m-2 w-2/5 rounded-lg h-90 justify-center"
          onSubmit={handleImportCourse}
        >
          <div className="flex justify-center text-lg font-semibold pt-2">
            <p>นำเข้ารายวิชา</p>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col justify-center  text-base pt-2 w-9/12">
              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">รหัสวิชา</p>
                </label>
                <input
                  type="text"
                  className="rounded-full p-3 text-sm py-1.5 w-3/5 "
                  placeholder="รหัสวิชา"
                  onChange={(event) => setSubject_id(event.target.value)}
                />
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">หลักสูตร</p>
                </label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="rounded-full pl-1 text-sm py-1.5 w-3/5 "
                  name="year"
                  id="year"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">ชื่อวิชา-อังกฤษ</p>
                </label>
                <input
                  type="text"
                  className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                  placeholder="ชื่อวิชาภาษาอังกฤษ"
                  onChange={(event) => setSubject_nameEN(event.target.value)}
                />
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">ชื่อวิชา-ภาษาไทย</p>
                </label>
                <input
                  type="text"
                  className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                  placeholder="ชื่อวิชาภาษาไทย"
                  onChange={(event) => setSubject_nameTH(event.target.value)}
                />
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">ประเภท</p>
                </label>
                <select
                  className="rounded-full pl-1 text-sm py-1.5 w-3/5 "
                  name="year"
                  id="year"
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="">ประเภทวิชา</option>
                  <option value={"1"}>วิชาแกน</option>
                  <option value={"2"}>วิชาเฉพาะบังคับ</option>
                  <option value={"3"}>วิชาเลือก</option>
                </select>
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">หน่วยกิต</p>
                </label>
                <input
                  type="text"
                  className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                  placeholder="หน่วยกิต"
                  onChange={(event) => setCredit(parseInt(event.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2 pr-3">
            <button
              className="bg-rose-color font-semibold text-white m-1 p-1 rounded-full w-1/4 hover:bg-red-900 active:bg-neutral-800"
              type="submit"
            >
              เพิ่ม
            </button>
          </div>
        </form>
      </div>

      <form className="justify-center">
        <div className=" flex flex-row justify-between pt-2">
        <label className="flex flex-col px-2 w-3/5" for="name">
                  <p className="pr-1">ค้นหา</p>
          <input
            className="rounded-full px-2 text-sm py-2 w-full border-2 border-rose-color"
            placeholder="ค้นหารายวิชา"
            value={filterValue}
            onChange={handleFilterChange}
          />
          {/* ส่วนอื่นๆของ input กรองข้อมูล */}
          </label>
          <label className="px-2 w-2/5" for="name">
                  <p className="pr-1">หลักสูตรการศึกษา</p>
                  <select
                    className="rounded-full px-2 text-sm py-2 w-full border-2 border-rose-color "
                    name="select_year"
                    id="select_year"
                    value={selectedYear} // กำหนดค่า selectedYear เข้าไป
                    
                  >
                    
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
        </label>
        </div>
        <table className="table-auto">
          <thead>
            <tr>
              <th>สถานะ</th>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชาภาษาอังกฤษ</th>
              <th>ชื่อวิชาภาษาไทย</th>
              <th>หน่วยกิต</th>
              <th>ประเภท</th>
              <th>
                <div className="justify-center items-center w-full">
                  <div className="flex flex-row w-full">
                    <button
                      type="button"
                      className="w-full p-2 my-2 mx-2 bg-red-300 rounded-lg  hover:bg-zinc-500"
                      onClick={handleCheckAll_open}
                    >
                      {buttonText_open}
                    </button>
                    
                  </div>
                  <div className="flex flex-row ">
                  <button
                      type="button"
                      className="p-2 my-2 mx-2 rounded-lg bg-yes-color w-1/2 hover:bg-zinc-500"
                      onClick={handleOpen}
                    >
                      เปิด
                    </button>
                    <button
                      type="button"
                      className="p-2 my-2 mx-2 rounded-lg bg-yes-color w-1/2 hover:bg-zinc-500"
                      onClick={handleOpen}
                    >
                      ปิด
                    </button>
                  </div>
                </div>
              </th>
              <th>
                <div className="justify-center items-center">
                  <div className="flex flex-row">
                    <button
                      className="p-2 my-2 mx-2 bg-red-300 rounded-lg w-1/2 hover:bg-zinc-500"
                      type="button"
                      onClick={handleCheckAll_delete}
                    >
                      {buttonText_delete}
                    </button>
                    <button className="p-2 my-2 mx-2 rounded-lg bg-no-color w-1/2 hover:bg-zinc-500" onClick={handleDelete} >
                      ลบ
                    </button>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourseData.map((item) => (
              <tr key={item.subject_id}>
                <td>
                  {
                    item.enable === 1 ?
                    <p className="bg-green-600 text-white m-2 py-1 rounded-md">เปิด</p>
                    :
                    <p className=" bg-red-600 text-white m-2 py-1 rounded-md">ปิด</p>
                  }
                </td>
                <td>
                  <p>{item.subject_id}-{item.school_year.slice(2,4)}</p>
                </td>
                <td>
                  <p>{item.subject_nameEN}</p>
                </td>
                <td>
                  <p>{item.subject_nameTH}</p>
                </td>
                <td>
                  <p>{item.credit}</p>
                </td>
                <td>
                  <p>
                    {item.type === "1"
                      ? "วิชาแกน"
                      : item.type === "2"
                      ? "วิชาเฉพาะบังคับ"
                      : "วิชาเลือก"}
                  </p>
                </td>

                <td>
                  <label key={item.subject_id}>
                    <input
                      type="checkbox"
                      className="accent-rose-color w-7 h-7"
                      onChange={(event) => event.target.checked ? handleCheckboxChange_open(item.subject_id) : handleCheckboxChange_open_unChecked(item.subject_id)}
                      checked={selectedItems_open[item.subject_id]}
                    />
                  </label>
                </td>

                <td>
                  <label key={item.subject_id}>
                    <input
                      type="checkbox"
                      className="accent-rose-color w-7 h-7"
                      onChange={(event) => event.target.checked ? handleCheckboxChange_delete(item.subject_id) : handleCheckboxChange_delete_unChecked(item.subject_id)}
                      checked={selectedItems_delete[item.subject_id]}
                    />
                  </label>
                </td>
                <td>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
    );
  }
  
  export default ImportSubject;