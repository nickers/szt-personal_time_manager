function showGantt(ganttData) {
  try {
  $("#ganttChart").ganttView({ 
    data: ganttData,
    slideWidth: '100%',
    behavior: {
      draggable: false,
      resizable: false,
      onClick: function (data) { 
        var msg = "You clicked on an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
        $("#eventMessage").text(msg);
      },
      onResize: function (data) { 
        var msg = "You resized an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
        $("#eventMessage").text(msg);
      },
      onDrag: function (data) { 
        var msg = "You dragged an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
        $("#eventMessage").text(msg);
      }
    }
  });
  } catch (e) {
    console.log("Exception : " + e);
    console.log("Exception : " + e.description);
  }
  // $("#ganttChart").ganttView("setSlideWidth", 600);
};