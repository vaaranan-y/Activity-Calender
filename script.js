
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

var x = 0
var y = 0
var currentElement = 0;
toDrag = null

const containers = document.querySelectorAll("div.p1 table tr td")
const draggables = document.querySelectorAll("div.sidemenu table tr td img")
console.log(containers)
console.log(draggables)


for(let i = 0; i < 36; i++){
	draggables[i].addEventListener("touchstart", () => {
		currentElement = i;

		console.log(currentElement)
		toDrag = draggables[currentElement].cloneNode(true)
		// draggables[currentElement].style.visibility = "hidden"
		
	})

}

for (item of draggables){
	item.addEventListener("touchmove", () => {
		x = event.touches[0].clientX;
		y = event.touches[0].clientY;
		console.log("dragging")
		document.body.append(toDrag);
		toDrag.style.position = "absolute";
		toDrag.style.width = "250px";
		toDrag.style.left = x+'px';
  		toDrag.style.top = y+'px';

	})
}

for (item of draggables){
	item.addEventListener("touchend", () => {
		toDrag.remove();
		console.log("released")
		newContainer = document.elementFromPoint(x, y)
		newContainer.append(draggables[currentElement])
		if (newContainer.className === "section-1" || newContainer.className === "section-2"){
			newContainer.append(draggables[currentElement])
		}
		
	})
}