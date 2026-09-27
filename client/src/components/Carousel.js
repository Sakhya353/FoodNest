import React from 'react'

export default function Carousel() {
    return (
        <div>
            <h1>Holllllllaaaaaaaaaa</h1>
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{objectFit:"contain !important"}}>
                <div className="carousel-inner" id='carousel'>
                    <div className='carousel-caption' style={{zIndex:"10"}}>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success text-white bg-success" type="submit">Search</button>
                        </form>
                    </div>
                    <div className="carousel-item active">
                        <img src="https://www.macopkg.com/wp-content/uploads/2023/02/supermarket-aisle-1536x1152.jpg" className="d-block w-100" style={{filter:"brightness(40%)"}} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://www.indiafoodnetwork.in/wp-content/uploads/2019/07/Chocoalates-cover-web.jpg" className="d-block w-100" style={{filter:"brightness(40%)"}} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://www.tastingtable.com/img/gallery/20-lays-potato-chip-flavors-ranked/intro-1684954432.webp" className="d-block w-100" style={{filter:"brightness(40%)"}} alt="..." />
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
    )
}
