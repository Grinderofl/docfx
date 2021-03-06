// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE file in the project root for full license information.

var port = document.body.childNodes[0].data;

var lastLocation = 0;

var fileName = document.body.childNodes[1].data;

var rightClick = false;

// Communication with extension to get the selection range of activeEditor
setInterval(function () {
  $.get("http://localhost:" + port.toString() + "/MatchFromLeftToRight")
    .done(function (data) {
      var editorSelectionRange = data.split(" ");
      var currentLocation = parseInt(editorSelectionRange[0]);
      // Focus on the corresponding line only when the editor selection range changed
      if (lastLocation !== currentLocation) {
        if (rightClick) {
          lastLocation = currentLocation;
          rightClick = false;
          return;
        }
        var centerLocation = currentLocation;
        var selectItem = $("[sourcefile='" + fileName + "']").filter(function (index) { return $(this).attr('sourcestartlinenumber') <= centerLocation && $(this).attr('sourceendlinenumber') >= centerLocation }).last();
        // If result of selection is empty selection, focus on the end of last node
        while (selectItem.length === 0) {
          centerLocation--;
          selectItem = $("[sourcefile='" + fileName + "']").filter(function (index) { return $(this).attr('sourcestartlinenumber') <= centerLocation && $(this).attr('sourceendlinenumber') >= centerLocation }).last();
        }
        $("body,html").animate({
          scrollTop: selectItem.offset().top
        }, 0);
        lastLocation = currentLocation;
      }
    })
}, 500);

$(document).ready(function () {
  $("[sourcefile]").click(function () {
    if ($(this).attr('sourcefile') === fileName) {
      rightClick = true;
      $.get("http://localhost:" + [port.toString(), "MatchFromRightToLeft", $(this).attr('sourcestartlinenumber'), $(this).attr('sourceendlinenumber')].join("/"));
    }
    else {
      // TODO: add the lineNumber information of file include in Html
    }
  });
})
