import * as $ from "jquery";

import { changePage } from "./model.js";
import { signUserUp, signUserOut,signUserIn} from "./model";



const hamburgerMenu = document.querySelector('.hamburger-menu');
const nav = document.querySelector(".nav");

hamburgerMenu.addEventListener("click", () => {
  nav.classList.toggle("active");
});

function initListeners() {


   
    $("nav").on("click", "a", function (e) {
        let id = e.currentTarget.id;
       
        $("#app").html(id);
        nav.classList.toggle("active");
    });

    $(".nav").on("click", function (e) {
        nav.classList.remove("active");
    });

    $("#app").on("click", "#signup", () => {
        const firstName = $("#firstname").val();
        const lastName = $("#lastname").val();
        const email = $("#email").val();
        const password = $("#password").val();
    
        signUserUp(firstName,lastName,email,password)

        console.log(firstName,lastName,email,password);
        if (!firstName || !lastName || !email || !password) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "All fields are required",
            });
        } else {
            Swal.fire({
            
                text: "Thank you for signing up",
                icon: "success"
              });
        }
    });
    




$("#app").on("click", "#siSubmit", () => {
    let siEmail = $("#siEmail").val();
    let siPassword = $("#siPassword").val();
    signUserIn(siEmail,siPassword);
    console.log(signUserIn);

   
    

    if (!siEmail || !siPassword) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "All fields are required",
        });
    } else {
        Swal.fire({
            html: `Thank you for signing in. Your <strong style="color: #FF5733;">Navigation Options</strong> have been updated.`,
            icon: "success"
          });
    }


}) 












}





function initSite() {
    $(window).on("hashchange", route);
    route();
}

function route() {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
    console.log("route", pageID);
    
   

    changePage(pageID);



   
}




$(document).ready(function () {

   

   changePage("home");
// changePage("login");
    initSite();
   
    initListeners();

  
});
