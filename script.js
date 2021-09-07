/**
 * Activity Calendar App
 * 2021-08-31
 * PM: Jack Everard
 * Developers: Vaaranan Yogalingam, Kyle Flores
 */

// Initializing variables and constants
var open = false;
var itemCount = 0
const sideMenu = document.querySelector(".sidemenu");
// Coordinates of the currently selected element
var x = 0
var y = 0
// Index of element being dragged (i.e. its position relative to all the other images in the side menu library)
var currentElement = 0;
// Element being dragged currently OR last element that was dragged
var toDrag = null
// Array of elements that have already been dragged onto the calendar from the libraray
var copies = [];
// Cells of the calendar table
const containers = document.querySelectorAll("div.p1 table tr td")
// Images that can be dragged from the library
const draggables = document.querySelectorAll("div.sidemenu table tr td img")

// Initializing the date functionality of the app
// Note how sunday is a special case (in the Date library, Sunday = 0, Monday = 1, etc. but in our calendar, "This week" = 0, Monday = 1, ... Sunday = 7)
function setUpDate(){
	var dateToday = new Date();
	var day = dateToday.getDay();
	const days = document.querySelectorAll("div.p1 table tr th");
	if(day == 0){
		var sunday = 7;
		days[sunday].style.backgroundColor = "#c5e6f5" ;
		for(var i = sunday - 1; i < 21; i += 7){
			containers[i].style.backgroundColor = "#c5e6f5";
		}
	} else {
		days[day].style.backgroundColor = "#c5e6f5";
		for(var i = day - 1; i < 21; i += 7){
			containers[i].style.backgroundColor = "#c5e6f5";
		}
	}
}

// Slide-in library menu functionality initialization
function initializeSideMenu(){
	sideMenu.addEventListener("click", () => {	
		if (open){
			sideMenu.style.right = "-21vw"
			open = false;
		} else {
			sideMenu.style.right = "0px"
			open = true;
		}
	})
}

// Initializes event listeners for each of the library images (so they can be dragged)
function initializeLibraryListeners(){
	// 1. When an image from the library is clicked
	for(let i = 0; i < draggables.length; i++){
		draggables[i].addEventListener("touchstart", () => {
			currentElement = i;
			toDrag = draggables[currentElement].cloneNode(true)
			toDrag.classList.add("copy");
		})

	}

	// 2. When an image from the library is held onto, and being dragged
	for (item of draggables){
		item.addEventListener("touchmove", () => {
			x = event.touches[0].clientX;
			y = event.touches[0].clientY;
			document.body.append(toDrag);
			toDrag.style.position = "absolute";
			toDrag.style.width = "250px";
			toDrag.style.left = x+'px';
			toDrag.style.top = y+'px';

		})
	}

	// 3. When an image from the library has been released
	for (item of draggables){
		item.addEventListener("touchend", () => {
			// toDrag.style.display = "none" --> idk if this is necessary

			// Check if element was dragged to top of screen, with intent of being deleted
			// Otherwise, append the image to wherever the user released
			if ((y <= 0) || document.elementFromPoint(x, y).classList.contains("deletion-box")){
				toDrag.remove();
				localStorage.setItem("latest version", document.body.innerHTML);
			} else {
				itemCount += 1;
				toDrag.style.display = "block"
				// Add the dragged in image to array of images on the calendar (i.e. the 'copies' array)
				copies.push(toDrag);
				// Update the copies array
				updateCopies();
				// Store the latest version of the calendar in local memory
				localStorage.setItem("latest version", document.body.innerHTML);
			}
		})
	}
}


// Adds event listeners to the images on the calendar, in the same way we added event listeners to each image in the library
function updateCopies(){
	// Get the latest image added to the calendar (so we can initialize event listeners for it)
	var latestImage = copies[copies.length - 1]

	// 1. When an image on the calendar is clicked
	copies[copies.length - 1].addEventListener("touchstart", () => {
		// Keep this event listener for now (not sure if there would be an error without it)
	})

	// 2. When an image on the calendar is held onto, and being dragged
	copies[copies.length - 1].addEventListener("touchmove", () => {
		x = event.touches[0].clientX;
		y = event.touches[0].clientY;
		document.body.append(latestImage);
		latestImage.style.position = "absolute";
		latestImage.style.width = "250px";
		latestImage.style.left = x+'px';
		latestImage.style.top = y+'px';
	})

	// 3. When an image on the calendar has been released
	copies[copies.length - 1].addEventListener("touchend", () => {
		latestImage.style.display = "none"
		if ((y <= 0) || document.elementFromPoint(x, y).classList.contains("deletion-box")){
			latestImage.remove();
			index = copies.indexOf(latestImage)
			copies.splice(index, 1);
			localStorage.setItem("latest version", document.body.innerHTML);
		} else {
			latestImage.style.display = "block"
			localStorage.setItem("latest version", document.body.innerHTML);
		}
	})
}

// Reloads latest version
function reloadPreviousCalendar(){
	// Get latest version of the body of the calendar app
	var latestBody = localStorage.getItem("latest version")
	// After "</script>" is when the newly added images appear, which is what we want to load when opening the app (these images are stored in index 1 of the array)
	x = latestBody.split("</script>")
	// Convert the string containing the images we want to load into actuall html (now stored in the body of some sample HTML)
	convertedToHTML = new DOMParser().parseFromString(x[1], 'text/html');
	// Store the actual image elements in an array of image elements what we will now load
	imagesToLoad = convertedToHTML.body.children
	// Append each image to the body (note that after appending one element from the array, you also remove that element from the array, which is why this for loop is strange)
	for(var i = 0; imagesToLoad.length != 0; i += 0){
		copies.push(imagesToLoad[i]);
		updateCopies();
		document.body.append(imagesToLoad[i])
	}
}

// Fully implementing this/next week feature
function moveIntoNextWeek(){
	var dateToday = new Date();
	if(dateToday.getDay() == 1 && localStorage.getItem("reset1?") == "false"){
		// It is monday and the week hasn't been reset yet so we need to move next week's schedule to this week
		var newThisWeek = localStorage.setItem("latest version 2")
		localStorage.setItem("latest version", newThisWeek)
		localStorage.setItem("reset1?", "true")
	} else if (dateToday.getDay() != 1){
		// It is not monday, so we can say that the week hasn't been reset yet
		localStorage.setItem("reset1?", "false")
	}
	// Note: there is no option for if the day is monday and the week has been reset yet because we wouldn't 
	// need to do anything then
}

// Invoke all methods needed to boot up app
setUpDate();
initializeSideMenu();
initializeLibraryListeners();
reloadPreviousCalendar();
moveIntoNextWeek();




/**
 * SAVING AND RELOADING DATA
 * 
 * to get latest version, recall localStorage.setItem("latest version", document.body.innerHTML);
 * therefore do the following
 * 1. var latestBody = localStorage.getItem("latest version")
 * 2. x = latestBody.split("</script>\n")
 * 3. Parse this string as so:
 * 		imagesToAdd = new DOMParser().parseFromString(x[1], 'text/html');
 * 4. Now the images are stored as elements in 'document.body.children'
 * 5.copies.push(imagesToAdd.body.children[x]) AND updateCopies() where x goes from 0 to length of array
 * 6. document.body.append(imagesToAdd.body.children[x]);
 */		

// * Now you have a string containing all the latest images
// * y = x[1].split(">")
// * for(var i = 0; i < x.length() - 1; i += 1){
// 	   y[i] += '>'
//    }
// * images = [];
// * for(var i = 0; i < x.length() - 1; i += 1){
// 		 imageToAdd = new DOMParser().parseFromString(y[i], 'text/xml');
// 	   images.push()
//    }

// a = imagesToAdd.body.children
// for(var i = 0; i < 6; i += 1){
// 	copies.push(a[i]);
// 	updateCopies();
// }