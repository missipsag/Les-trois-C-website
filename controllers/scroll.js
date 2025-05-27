window.addEventListener("scroll",()=>{
    const navbar = document.getElementById("nav");
    const sticky = navbar.offsetTop;
    if (window.scrollY>= sticky){
        navbar.classList.add("scroll");
    }
   else{
    navbar.classList.remove("scroll");
}
})


window.addEventListener('DOMContentLoaded', (event) => {
    const navoutHeight = document.querySelector('#navout').offsetHeight;
    document.querySelector('#indexnav #menu-map').style.top = `${navoutHeight}px`;
});
