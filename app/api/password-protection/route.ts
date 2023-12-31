export async function POST(request: Request) {
  const { password, pageSlug } = await request.json();

  try {
    const passwordIsValid = validatePagePassword(pageSlug, password);
    return Response.json(
      { isValid: passwordIsValid },
      { status: passwordIsValid ? 200 : 401 }
    );
  } catch (error) {
    console.log("Error validating password", error);

    return Response.json({ isValid: false }, { status: 401 });
  }
}

function validatePagePassword(pageSlug: string, password: string) {
  return password === process.env.PASSWORD_PROTECTION_PHOTOS;
}
