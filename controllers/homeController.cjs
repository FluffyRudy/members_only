const homepageGet = async (req, response) => {
  response.render("home");
};

module.exports = { homepageGet };
