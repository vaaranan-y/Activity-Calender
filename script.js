
open = false;

const sideMenu = document.querySelector(".sidemenu");
console.log(sideMenu)

sideMenu.addEventListener("click", () => {
	
	if (open){
		sideMenu.style.right = "-19vw"
		open = false;
	} else {
		sideMenu.style.right = "0px"
		open = true;
	}
})

