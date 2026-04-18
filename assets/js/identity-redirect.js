/* ============================================================
   NETLIFY IDENTITY REDIRECT
   Нэвтэрсэн хэрэглэгчийг admin хэсэг рүү автомат чиглүүлэх
   ============================================================ */
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}
