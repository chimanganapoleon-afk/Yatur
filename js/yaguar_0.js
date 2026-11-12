
document.querySelectorAll(".nav-links a").forEach(link=>{
  link.addEventListener("click",()=>{
    document.querySelectorAll(".nav-links a").forEach(a=>a.classList.remove("active"));
    link.classList.add("active");
  });
});
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
