import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { Link } from 'react-router-dom';

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  const loadData = async () => {
    let response = await fetch(`${API_BASE_URL}/foodData`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    response = await response.json();

    setFoodItem(response[0]);
    setFoodCat(response[1]);
    //console.log(response[0],response[1]);
  }

  useEffect(() => {
    loadData()
  }, []);



  return (
    <div>
      <div><Navbar /></div>
      <div>
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{objectFit:"contain !important"}}>
                <div className="carousel-inner" id='carousel'>
                    <div className='carousel-caption' style={{zIndex:"10"}}>
                        <div className="d-flex justify-content-center">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={search} onChange= {(e)=>{setSearch(e.target.value)}} />
                            {/*<button className="btn btn-outline-success text-white bg-success" type="submit">Search</button> */}
                        </div>
                    </div>
                    <div className="carousel-item active">
                        <img src="https://media.istockphoto.com/id/1449032425/photo/shopping-bag-full-of-healthy-food-on-blue.jpg?s=612x612&w=0&k=20&c=856XpqRgq8Bj9Mr28VzAdW-iTyHEj_dW01m6SPPHsOU=" className="d-block w-100" style={{filter:"brightness(40%)"}} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://media.istockphoto.com/id/1157106624/photo/all-your-necessities-stored-in-one-place.jpg?s=1024x1024&w=is&k=20&c=8Wpn6NRdkVmXtR5jxGmxnyqu_wY3kF6yMMXWHla0t5Y=" className="d-block w-100" style={{filter:"brightness(40%)"}} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://media.istockphoto.com/id/693171708/photo/fresh-vegetables-on-shelf-in-supermarket.jpg?s=1024x1024&w=is&k=20&c=3pXSfdeB7np1T4DDdJKgkQSZ3kyg63_AHPJRSKzsfW0=" className="d-block w-100" style={{filter:"brightness(40%)"}} alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
      </div>
      <div className='container'>
        {
          foodCat !== []
            ? foodCat.map((data) => {
              var check="/"+data.CategoryName;
              return (<div className='row mb-3'>
                <div key={data._id} className='fs-3 m-3'>
                 <Link className="nav-link active fs-8 text-info" aria-current="page" to={check} >{data.CategoryName}</Link> 
                </div>
                <hr />
                {foodItem !== []
                ?
                foodItem.filter((item)=>(item.CategoryName === data.CategoryName)&&(item.name.toLowerCase().includes(search.toLocaleLowerCase())))
                .map(filterItems=>{
                  return(
                    <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 '>
                      <Card foodItem={filterItems }
                      options={filterItems.options[0]}
                      >
            
                      </Card>
                    </div>
                  )
                }):<div>No such data</div> }
                  

                   
                </div>
              )
            })
            : ""
        }
        

      </div>
      <div><Footer /></div>
    </div>
  )
}
