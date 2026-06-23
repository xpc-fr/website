// Révélation de l'email de contact sans l'exposer en clair (anti-scraping).
(function () {
  var btn = document.getElementById('reveal-email');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var user = btn.getAttribute('data-user');
    var domain = btn.getAttribute('data-domain');
    var addr = user + String.fromCharCode(64) + domain; // 64 = '@'
    var a = document.createElement('a');
    a.href = 'mailto:' + addr;
    a.textContent = addr;
    btn.replaceWith(a);
  });
})();
