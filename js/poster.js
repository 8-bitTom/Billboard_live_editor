//poster Editor to Jpeg Demo
//Author Tom Marra tmarra@lamar.com 7/24/12

//global Vars
var photoMaxH = 0;
var photoMaxW = 0;

//Where all the magic happens
$('document').ready(function(){

	//Hide Image/text Ui on start and show only on rollover of billboard Image
	$('#image_editor').hide();
	$('#text_editor').css({top: "135px", left: "430px"}).hide();

	$('.postrBg').mouseenter(
		function(){
			$('#image_editor').show();
			$('#text_editor').show();
		}
	);

	$('.postrBg').mouseleave(function(){
			$('#image_editor').hide();
			$('#text_editor').hide();
	});

	//set the text editor button functions
	$('#leftbtn').button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-w"
            },
            text: false
        }).click(function(){
        	$(".textarea").css({textAlign : "left"});
        });

	$('#centerbtn').button({
            icons: {
                primary: "ui-icon-arrowthick-2-e-w"
            },
            text: false
        }).click(function(){
        	$(".textarea").css({textAlign : "center"});
        });

	$('#rightbtn').button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-e"
            },
            text: false
        }).click(function(){
        	$(".textarea").css({textAlign : "right"});
        });

	$('#plusbtn').button({
            icons: {
                primary: "ui-icon-plus"
            },
            text: false
        }).click(function(){
        	var currentSize = $(".textarea").css("fontSize");
        	$(".textarea").css("fontSize" , parseInt(currentSize) + 1);
        });

	$('#minusbtn').button({
            icons: {
                primary: "ui-icon-minus"
            },
            text: false
        }).click(function(){
        	var currentSize = $(".textarea").css("fontSize");
        	$(".textarea").css("fontSize" , parseInt(currentSize) - 1);
        });

    $('#upbtn').button({
            icons: {
                primary: "ui-icon-arrowthick-1-n"
            },
            text: false
        }).click(function(){
        	var currentPos = $(".textarea").css("margin-top");
        	$(".textarea").css("margin-top" , parseInt(currentPos) - 2);
        });

    $('#downbtn').button({
            icons: {
                primary: "ui-icon-arrowthick-1-s"
            },
            text: false
        }).click(function(){
        	var currentPos = $(".textarea").css("margin-top");
        	$(".textarea").css("margin-top" , parseInt(currentPos) + 2);
        });

	
	//bind textArea to autoGrow MAy wish to change to ID instead of class
	$(".textarea").css('overflow', 'hidden');//.autogrow();

	//if the Text area has the Default message clear it on click
	$(".textarea").click(function(){
		if($(".textarea").text() == "welcome to Lamar Postr..."){
			$(".textarea").text("");
		}
	})
	
	//fade out preview so it will fade in correctly later
	$("#preview").fadeOut({duration: 0});

	
	//fades out editor and fades in Client-side generated JPEG
	//Final version could skip this step or add a cancel button
	$('#tojpg').click(function(){
		//disable button to prevent spamming
		$('#tojpg').attr("disabled", "disabled");

		$('.postr_banner').html2canvas({
        	onrendered: function( canvas ) {

        	   //converts canvas data from HTML2Canvas into a JPEG Requires flash support in page for ie<9	
               var a = canvas.toDataURL("image/JPEG", 1);

               //fades out editor adds a element to the preview container and fades it in
               $("#bannercontainer").fadeOut(function(){
               		 $("#preview").append("<img src='"+a+"' style='width:"+$('.postr_banner').css("width")+";' />").fadeIn();
           			 $("#preview").append('<br /><button style="margin-left:43px; margin-top:40px;" onClick="destroyPreview()">Submit (disabled in the example)</button>');		
               });          
            }
        });
	});

});

//deletes the preview image and fades in the editor
function destroyPreview(){
	$('#preview').fadeOut(function(){
		$('#preview').empty();
		$("#preview").css({ padding : "0px", border: "none"});
		$("#bannercontainer").fadeIn(function(){
			//re-enable button
			$('#tojpg').removeAttr("disabled");
		});
	});
	
}

//makes the File upload work with my PHP based localhost
function createUploader(){            
            var uploader = new qq.FileUploaderBasic({
                button: $('#uploader')[0],
                action: 'php/php.php',
                allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
                debug: true,
                onComplete: function(id, fileName, responseJSON){

                	//THIS PART IS IMPORTANT AND MUST BE IMPLEMENTED IN FINAL SCRIPT
                	//put the uploaded image inside the frame and make it jqueryUI dragable
                    $('.photoframe').append("<img id='userImg' src='php/uploads/"+fileName+"' />");
                    $('#userImg').load(
                    	function(){
	                    	photoMaxH = $('#userImg').height();
	                    	photoMaxW = $('#userImg').width();
	                    	console.log("set initial height = " + $('#userImg').height() + " & initial width = " + $('#userImg').width() );

	                    });
                    $('#userImg').draggable().css({cursor : "move"});

                    //make zoom slider
					$('#zoomSlider').slider({ 
						max: 150, 
						min: 25, 
						value: 100, 
						slide: function(event, ui) {  
							var xW = (ui.value/100)*photoMaxH + "px"
							$('.photoframe').children('img').attr({
								width: xW
							})
						}
					});

                    //hide the uploader input TODO:make a cancel button in the UI to bring this back and clear the previously uploaded image
                    $('#uploader').hide();


                    //unimportant log showing filename for my reference
                    console.log("id: " + id + ", fileName: " + fileName + ", responseJSON: " + responseJSON);
                }
            });           
        }
        
// in your app create uploader as soon as the DOM is ready
// don't wait for the window to load  
window.onload = createUploader;