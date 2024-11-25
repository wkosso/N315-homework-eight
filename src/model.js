import * as $ from "jquery";
import { createUserWithEmailAndPassword,getAuth, signInWithEmailAndPassword,signOut,onAuthStateChanged } from "firebase/auth";
import {app } from "./firebaseConfig";


const auth= getAuth(app);

const userRecipes = [];
var currentRecipeId = "";
let isEditMode = false;
//I commented here

onAuthStateChanged(auth, (user)=>{
    if(user){
        console.log("user is signed in");
        $("#authState").css("display", "block");
     $("#login").text("Sign Out").on("click", () => {
            signUserOut();
        });
    }else{
        // console.log("User is signed out for real");
        // $("#authState").css("display", "none");
    }
});

export function changePage(pageName) {
  console.log("pageName", pageName);

  // Load the page content into #app dynamically
  $.get(`pages/${pageName}.html`, (data) => {
    $("#app").html(data);

      if (pageName === "recipe") {
          addRecipeListeners();
          
      } else if (pageName === "yourrecipe") {
          console.log("userRecipes:", userRecipes);
        


           

          userRecipes.forEach((recipe,index) => {
           
const recipeHTML = `
<div class="yourrec-InfoContainer">
    <div class="yourrec-ImageHolder">
        <div class="yourrecImg" style="background-image: url(${recipe.recipeImageURL});">
        <div class="viewBtn" id="${index}">
  <a href="#view">View
</div></a>

        </div>
    </div>
    <div class="yourrec-ImgDashboard">
        <div class="dash-title">${recipe.recipeName}
            <div class="dash-hr"></div>
        </div>
        <div class="dash-text">${recipe.recipeDescription}</div>
        <div class="dash-timerContainer">
            <div class="timer-logo"></div>
            <div class="dash-timer">${recipe.recipeTotalTime}</div>
        </div>
        <div class="dash-servingContainer">
            <div class="serve-logo"></div>
            <div class="dash-serve">${recipe.recipeServingSize}</div>
        </div>
    </div>
</div>
<div class="editDelete-box">
    <div class="editBtn   editjq"  id="${index}"><a href="#edit">Edit Recipe</a></div>
  <div class="deleteBtn" id="${index}">Delete</div>
</div>
`;


$(".all-recipes").append(recipeHTML);


            
        });
     
   
       addViewRecipeListener();
       editRecipeListerners();
       deleteRecipeListeners();
         removeRecipeListeners();
      }else if (pageName === "view") {
        const recipeId = window.selectedRecipeId; // Retrieve the selected recipe ID
        const recipe = userRecipes[recipeId]; // Find the corresponding recipe

        if (recipe) { 
              
              const recipeHTML = `
              <div class="viewRecipe-InfoBox">
                  <div class="recipe-viewFlexBox">
                      <div class="recipe-titleContainer">${recipe.recipeName}</div>
                      <div class="view-recipeImgContainer">
                          <div class="view-recipeImg" style="background-image: url('${recipe.recipeImageURL}');"></div>
                      </div>
                      <div class="view-recipeInfoSide">
                          <div class="InfoSide-destitle">Description:</div>
                          <div class="InfoSide-text">${recipe.recipeDescription}</div>
                          <div class="InfoSide-timetitle">Total Time:</div>
                          <div class="InfoSide-time">${recipe.recipeTotalTime}</div>
                          <div class="InfoSide-servingtitle">Servings:</div>
                          <div class="InfoSide-serving">${recipe.recipeServingSize}</div>
                      </div>
                  </div>
              </div>
              <div class="viewrecipe-itemsBox">
                  <div class="viewrecipe-ingTitle">Ingredients:</div>
                  <div class="viewrecipe-ingDes">${recipe.ingredients}</div>
                  <div class="viewrecipe-insTitle">Instructions:</div>
                  <div class="viewrecipe-insDes">${recipe.instructions}</div>
                  <div class="editBtn2   editjq"  id="${recipeId}"> <a href="#edit">Edit Recipe</a></div>
              </div>
              `;
           
           
            
              $("#app .recipesoloView").html(recipeHTML);
              editRecipeListerners();
          } else {
              console.error("Recipe not found for ID:", recipeId);
          }




      } else if (pageName === "browse") {
         getData();




          
  
      } else if ( pageName === "edit"){
        console.log("edited page",currentRecipeId);
        const recipe = userRecipes[currentRecipeId];
        $("#app #recipeName").val(recipe.recipeName).prop("readonly", false); 

        $("#app #imageURL").val(recipe.recipeImageURL).prop("readonly", false); 
      
        $("#app #recipeDes").val(recipe. recipeDescription).prop("readonly", false); 
      
      
        
        $("#app #recipeTotalTime").val(recipe. recipeTotalTime).prop("readonly", false); 
      
        
        $("#app #recipeTotalTime").val(recipe. recipeTotalTime).prop("readonly", false); 
      
        
        $("#app #recipeServingSize").val(recipe.  recipeServingSize).prop("readonly", false); 
      
        $("#app .ingreds input").val(recipe.ingredients).prop("readonly", false); 
      
      
        $("#app .instructs input").val(recipe.instructions).prop("readonly", false); 

      
      }
      
      else {
          removeRecipeListeners();
      }
        
      

  }).fail((error) => {
      console.log("Error loading page:", error);
  });




 function resetForm() {
    $("#recipeName").val("");
    $("#imageURL").val("");
    $("#recipeDes").val("");
    $("#recipeTotalTime").val("");
    $("#recipeServingSize").val("");
    $(".ingreds").empty(); 
    $(".instructs").empty(); 
  }
  



//  // Optional: Handle navigation display
//   if (pageName === "login") {
//       $("nav").css("display", "none");
//   } else {
//       $("nav").css("display", "block");
//   }
}

function addRecipeListeners() {


  $("#app").on("click", "#ingredBtn", () => {

      let currentIngredCount = $(".ingreds input").length;
      currentIngredCount++;

      $(".ingreds").append(
          `<input type="text" class="recipeInput" id="ingred${currentIngredCount}" placeholder="Ingredient #${currentIngredCount}" />`
        );



        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Ingredient added!',
          showConfirmButton: false,
          timer: 1500
      });

  });


$("#app").on("click", "#instructBtn", () =>{

  let currentInstructCount = $(".instructs input").length;
  currentInstructCount++;
  $(".instructs").append(
    `<input type="text"  class="recipeInput" id="instruct${currentInstructCount}" placeholder="Instruction #${currentInstructCount}" />`
  );


  Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Instruction added!',
      showConfirmButton: false,
      timer: 1500
  });
});

$("#app").on("click", ".submitBtn", () => {
let recipe = {
    recipeName: $("#recipeName").val(),
    recipeImageURL: $("#imageURL").val(),
    recipeDescription: $("#recipeDes").val(),
    recipeTotalTime: $("#recipeTotalTime").val(),
    recipeServingSize: $("#recipeServingSize").val(),
    ingredients: [],
    instructions: [],
};


$(".ingreds input").each(function () {
    recipe.ingredients.push($(this).val());
});

$(".instructs input").each(function () {
    recipe.instructions.push($(this).val());
});




if (
    !recipe.recipeName || 
    !recipe.recipeImageURL || 
    recipe.ingredients.length === 0 || 
    recipe.instructions.length === 0
) {
  if (!isEditMode) {
    Swal.fire({
        icon: "error",
        title: "All fields must be filled out.",
    });
}
   
}else{
    userRecipes.push(recipe);
  if (!isEditMode) {
    Swal.fire({
        title: "Your Recipe Has Been Created!",
        icon: "success"
    });

    changePage("yourrecipe");
}
}





$(".form input").val("");
  resetForm();
console.log(userRecipes);
});

  





}




function removeRecipeListeners() {
  $(".submitBtn").off("click");
  $("#instructBtn").off("click");
  $("#ingredBtn").off("click");
}


function getData() {

  $.getJSON("data/data.json", function (data) {

    let foods = data.Recipes;

    $.each(foods, (idx, food) => {
let foodString=`


<div class="yourrec-InfoContainer infoplus" >
    <div class="yourrec-ImageHolder">
        <div class="yourrecImg" style="background-image: url(${food.recipeImageURL});">
            
        </div>
    </div>
    <div class="yourrec-ImgDashboard">
        <div class="dash-title">${food.recipeName}
            <div class="dash-hr"></div>
        </div>
        <div class="dash-text">${food.recipeDescription}</div>
        <div class="dash-timerContainer">
            <div class="timer-logo"></div>
            <div class="dash-timer">${food.recipeTotalTime}</div>
        </div>
        <div class="dash-servingContainer">
            <div class="serve-logo"></div>
            <div class="dash-serve">${food.recipeServingSize}</div>
        </div>
    </div>
</div>




`;
$(".more-recipesContainer").append(foodString);
});


}).fail(function () {
  Swal.fire({
    title: "Something Went Wrong",
   
    icon: "error"
  });
});
}




export function addViewRecipeListener() {
  $(".viewBtn").on("click", (e) => {
    const recipeId = e.currentTarget.id; 
    console.log("View Button Clicked:", recipeId);

   
    changePage("view");

    
    window.selectedRecipeId = recipeId;
});
}





export function editRecipeListerners(){


 $(".editjq").on("click", (e) => {
  isEditMode = true;
  const recipeId = e.currentTarget.id; 
 
currentRecipeId = recipeId;

console.log("Edit Button Clicked:", currentRecipeId);
  





  });


  $("#submitBtn").on("click", function(e) {
    var updatedRecipeName = $("#app #recipeName").val(); 
    var updatedImageURL = $("#app #imageURL").val();  
    var updatedRecipeDes = $("#app #recipeDes").val();  
    var updatedTotalTime = $("#app #recipeTotalTime").val(); 
    var updatedServingSize = $("#app #recipeServingSize").val(); 
    var updatedIngredients = $("#app .ingreds input").val();
    var updatedInstruction = $("#app .instructs input").val()





    recipe.recipeName = updatedRecipeName;
    recipe.recipeImageURL = updatedImageURL;
    recipe.recipeDescription = updatedRecipeDes;
    recipe.recipeTotalTime = updatedTotalTime;
    recipe.recipeServingSize = updatedServingSize;
    recipe.ingredients = updatedIngredients;
    recipe.instructions= updatedInstruction;



    $("#app #recipeName").prop("readonly", true);
    $("#app #imageURL").prop("readonly", true);
    $("#app #recipeDes").prop("readonly", true);
    $("#app #recipeTotalTime").prop("readonly", true);
    $("#app #recipeServingSize").prop("readonly", true);
    $("#app .ingreds input").prop("readonly", true);
    $("#app .instructs input").prop("readonly", true); 
    isEditMode = false;

if(!isEditMode){
    Swal.fire({
      icon: "success",
      title: "Recipe updated successfully!",

  });
}


});

}

export function deleteRecipeListeners() {
  $(".deleteBtn").on("click", (e) => {
      const recipeId = e.currentTarget.id; 
     
     
      userRecipes.splice(recipeId, 1);

  

      
      Swal.fire({
          icon: "success",
          title: "Recipe deleted successfully!",
      });

      console.log("Recipe deleted:", recipeId, userRecipes);

      changePage("yourrecipe");
  });


}


export function signUserUp(fn,ln,email,password){
    createUserWithEmailAndPassword(auth,email,password)
    .then(()=>{
        console.log("user created");
        $("#authState").css("display", "none");
    })
    .catch((error)=>{
        console.log(error)
    });



}

    

export function signUserIn(email,password){
    signInWithEmailAndPassword(auth,email,password)
    .then(()=>{
        console.log("user signed in");
      //  $("#yourRecipe").css("display", "block")

      $("#authState").css("display", "block");
    })
    .catch((error)=>{
        console.log(error)
    });
  }


  export function signUserOut() {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
       // $("#yourRecipe").css("display", "none");
  changePage("login");
      })
      .catch((error) => {
        console.log("Error" + error);
      });
  }


