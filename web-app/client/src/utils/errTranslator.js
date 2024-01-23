const translateErrorMessage = (err) => {
  if (err?.response?.data?.message) {
    const message = err?.response?.data?.message;
    if (message.includes("for key 'household.email'")) {
      return "Opps !! E-mail address provided is already in use. Try new email";
    }
    if (message.includes("fk_Household_postalCode_PostalCode_postalCode")) {
      return "Opps !! The postal code you've provided is invalid";
    }
    return message;
  } else {
    console.log(err.message);
  }
};

module.exports = {
  translateErrorMessage,
};
