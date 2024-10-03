const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=id]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const prodEl = btn.closest("article");

  const data = fetch("/admin/products/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      console.log("res ", result.json());
      prodEl.parentNode.removeChild(prodEl);
    })
    .catch((err) => {
      console.log("err ", err);
    });
};
