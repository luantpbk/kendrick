export const normalizationZipcode = (zipcode: string) => {
  if (!zipcode) return zipcode;
  const normalizationZipcode = zipcode.replaceAll(new RegExp('[\\D]', 'g'), '');
  return normalizationZipcode;
};
