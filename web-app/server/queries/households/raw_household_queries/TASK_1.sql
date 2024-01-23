INSERT INTO Household(email, postalCode, household_type, square_footage, heating, cooling)
			VALUES($email, $postalCode, $household_type, $square_footage, $heating, $cooling);

INSERT INTO PublicUtilityLinkage(householdID, public_utility_id)
			VALUES($householdID, $public_utility_id);


