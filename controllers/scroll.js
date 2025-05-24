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