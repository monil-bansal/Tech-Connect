
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
function signOut(){
	auth.signOut();	
}
auth.onAuthStateChanged(function(user)  {
  if(user){
    
    var u = auth.currentUser;
  	var emailInput = user.email;
    db.collection("USERS").doc(emailInput).get().then(function (sn) {
      console.log(sn.data());
      document.getElementById("name").innerHTML = "Name: " + sn.data().Name;
      document.getElementById("email").innerHTML = "E-Mail: " + sn.data().email;
      if(sn.data().Interviewer){
      document.getElementById("category").innerHTML = "So get ready to take some kiss ass interviewes";
  		}
  		else{

      document.getElementById("category").innerHTML = "So get ready to give some interviewes";	
  		}
      
    });

  }
  else{
  	 window.location.href = "./login.html";
  }
});
