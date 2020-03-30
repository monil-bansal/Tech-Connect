function changeTab(ref){
  try {
  if(ref.getAttribute("data-tab") == "login"){
    document.getElementById("form-body").classList.remove('active');
    ref.parentNode.classList.remove('signup');
  } else {
    document.getElementById("form-body").classList.add('active');
    ref.parentNode.classList.add('signup');
  }
  } catch(msg){
    console.log(msg);
  }
}
var signup = false;
var firebaseConfig = {
  apiKey: "AIzaSyBWxdWYRYaTOIgjHU2H4OPakSrfhZ7Z1qA",
  authDomain: "interviewapp-74631.firebaseapp.com",
  databaseURL: "https://interviewapp-74631.firebaseio.com",
  projectId: "interviewapp-74631",
  storageBucket: "interviewapp-74631.appspot.com",
  messagingSenderId: "268988093733",
  appId: "1:268988093733:web:c69782a9408a3abd1a36cc",
  measurementId: "G-8EEM95QSX4"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth  = firebase.auth();
const db = firebase.firestore();
auth.signOut();
function login(){
  console.log("monil");
  var emailInput = document.getElementById("loginEmail");
  var passwordInput = document.getElementById("loginPassword");
  const promise = auth.signInWithEmailAndPassword(emailInput.value,passwordInput.value);
  promise.catch(e => alert(e.message));
}
function monil(){
  console.log("sign up");
  var emailInput = document.getElementById("signupEmail");
  var passwordInput = document.getElementById("signupPassword");
  var nameInput = document.getElementById("signupName");
  var interviewerOption = document.getElementById("interviewerOption");
  var intervieweeOption = document.getElementById("intervieweeOption");
  const promise = auth.createUserWithEmailAndPassword(emailInput.value,passwordInput.value);
  promise.catch(e => alert(e.message));
  signup = true;
}
auth.onAuthStateChanged(function(user)  {
  if(user){
    if(signup){
      var emailInput = document.getElementById("signupEmail");
      var passwordInput = document.getElementById("signupPassword");
      var nameInput = document.getElementById("signupName");
      var interviewerOption = document.getElementById("interviewerType");
      var intervieweeOption = document.getElementById("intervieweeType");
      db.collection("USERS").doc(emailInput.value).set({
          Name : nameInput.value,
          email : emailInput.value,
          password : passwordInput.value,
          Interviewer :  interviewerOption.checked,
          Interviewee : intervieweeOption.checked 
      })
      .then(function() {
          console.log("Document written with ID: ");
          alert("Signed Up! now go and enjoy");
          if(interviewerOption.checked){
            window.location.href = "./welcome.html";
          }
          else{
            window.location.href = "./intervieweePage.html"
          }
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    
    }
    else{
      // window.location.href = "./welcome.html";
      let emailInput = document.getElementById("loginEmail").value;
      var docRef = db.collection("USERS").doc(emailInput);

        docRef.get().then(function(doc) {
            let data  = doc.data();
            let interviewerOption = data["Interviewer"];
            if(interviewerOption){
              window.location.href = "./welcome.html";
            }
            else{
              window.location.href = "./intervieweePage.html"
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
    console.log("there");

  }
  // else{
  // }
});