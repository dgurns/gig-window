const isValidEmail = (email?: string) => {
  if (!email) return false;

  const validityRegex = new RegExp(
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  );
  return validityRegex.test(email);
};

const isSecurePassword = (password?: string) => {
  if (!password || password.length < 6) {
    return false;
  }
  return true;
};

const generateProfileImageAwsS3Key = (userId: number) => {
  return `users/${userId}/profileImage.jpeg`;
};

export default {
  isValidEmail,
  isSecurePassword,
  generateProfileImageAwsS3Key,
};
