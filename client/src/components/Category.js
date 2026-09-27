import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'

export const Category = (props) => {
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
          <div className='container'>
        {
          foodCat !== []
            ? foodCat.map((data) => {
              return (<div className='row mb-3'>
               {(data.CategoryName==props.CategoryName)? <div key={data._id} className='fs-3 m-3'>
                Similar {data.CategoryName}
                </div>:""}
                <hr />
                {foodItem !== []
                ?
                foodItem.filter((item)=>((item.CategoryName === data.CategoryName)&&(props.CategoryName === data.CategoryName))&&(item.name.toLowerCase().includes(search.toLocaleLowerCase())))
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
