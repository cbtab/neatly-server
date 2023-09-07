export const validateRegistrationData = (req, res, next) => {
  const { fullName, password, email, birth_day, country, idNumber } = req.body;

  if (password.length < 6) {
    return res.status(400).json({
      error: "Password is too short. It must be at least 6 characters long.",
    });
  }

  const names = fullName.trim().split(" ");
  if (
    names.length !== 2 ||
    !/^[a-zA-Z]*$/.test(names[0]) ||
    !/^[a-zA-Z]*$/.test(names[1])
  ) {
    return res.status(400).json({
      error:
        "Invalid full name. It should include both the first name and last name without numbers.",
    });
  }

  const emailPattern = /^\S+@\S+\.\S+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  const birthDate = new Date(birth_day);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  if (age < 18) {
    return res
      .status(400)
      .json({ error: "You must be at least 18 years old to register." });
  }

  if (!/^\d{13}$/.test(idNumber)) {
    return res.status(400).json({
      error: "Invalid ID number. It should contain exactly 13 numbers.",
    });
  }
  next();
};
