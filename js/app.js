var sub = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
var startups = [
  "tumblr",
  "Twitter",
  "Facebook",
  "Google Analytics",
  "Google Docs",
  "Dropbox",
  "Reddit",
  "Amazon",
  "Airbnb",
  "Pinterest",
  "Github",
  "Zynga",
  "PayPal",
  "Kickstarter",
  "Netflix",
  "Redbox",
  "Google",
  "Gawker",
  "Uber",
  "Zipcar",
  "Ebay",
  "Pandora",
  "Spotify",
  "Instagram",
  "FitBit",
  "Meetup",
  "Snapchat"
],
  stuff = [];
var url = location.href;

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
}

function encodeStr(uncoded) {
  uncoded = uncoded.toUpperCase().replace(/^\s+|\s+$/g,"");
  var coded = "";
  var chr;
  for (var i = uncoded.length - 1; i >= 0; i--) {
    chr = uncoded.charCodeAt(i);
    coded += (chr >= 65 && chr <= 90) ? 
      sub.charAt(chr - 65 + 26*Math.floor(Math.random()*2)) :
      String.fromCharCode(chr); 
    }
  return encodeURIComponent(coded);  
}

function decodeStr(coded) {
  coded = decodeURIComponent(coded);  
  var uncoded = "";
  var chr;
  for (var i = coded.length - 1; i >= 0; i--) {
    chr = coded.charAt(i);
    uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ?
      String.fromCharCode(65 + 32 + sub.indexOf(chr) % 26) :
      chr; 
    }
  return uncoded;   
} 

function gup( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
  var regexS = "[\\?&]"+name+"=([^&#]*)";  
  var regex = new RegExp( regexS );  
  var results = regex.exec( window.location.href ); 
  if( results == null ) {
    return "";  
  }
  else {
return results[1];
  }
}

function getWords(suppressGenerate) {
  $.when(
    $.ajax({
      url: 'http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=5&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun,adjective,verb&limit=1000&maxLength=22&api_key='+key.API_KEY,
      async: false,
      dataType:"json"
    })
  ).done(function(stuff_data) {
    stuff = $.map(stuff_data, function(el) { return el.word; });
    if (!suppressGenerate) {
      generate();
    }
  });
}

function generate(stuffPlural, stuffPlural2, stuffPlural3, startup, startup2, startup3) {
  stuffPlural = stuffPlural || stuff.pick().pluralize();
  stuffPlural2 = stuffPlural2 || stuff.pick().pluralize();
  stuffPlural3 = stuffPlural3 || stuff.pick().pluralize();
  startup = startups[startup] || startups.pick();
  startup2 = startups[startup2] || startups.pick();
  startup3 = startups[startup3] || startups.pick();
  var generatedText = startup + ' for ' + stuffPlural + '<br>' + startup2 + ' for ' + stuffPlural2 + '<br>' + startup3 + ' for ' + stuffPlural3;
  $('#content').html('<p>' + generatedText + '</p>');
  var shareUrl = location.href.split('?')[0]+'?word='+encodeStr(stuffPlural)+'$'+encodeStr(stuffPlural2)+'$'+encodeStr(stuffPlural3)+'$'+startups.indexOf(startup)+'$'+startups.indexOf(startup2)+'$'+startups.indexOf(startup3);
  $('#share').attr('href', shareUrl);
  $('.twitter-share-button').remove();
  var tweetText = 'Startup Idea Generator: ' + generatedText.replace(/<br>/g,', ');
  $('#twitterShare').html('<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + shareUrl + '" data-text="' + generatedText + '" data-lang="en">Tweet</a>');
  if (twttr.widgets) {
    twttr.widgets.load();
  }
}

$('#generate').click(function() { generate(); });;
if (gup('word') === "") {
  getWords();
}
else {
  var stuffPlural = decodeStr(unescape(gup('word')).split('$')[0]);
  var stuffPlural2 = decodeStr(unescape(gup('word')).split('$')[1]);
  var stuffPlural3 = decodeStr(unescape(gup('word')).split('$')[2]);
  var startup = gup('word').split('$')[3];
  var startup2 = gup('word').split('$')[4];
  var startup3 = gup('word').split('$')[5];
  getWords(true);
  generate(stuffPlural, stuffPlural2, stuffPlural3, startup, startup2, startup3);
}
