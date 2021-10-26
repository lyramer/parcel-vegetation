export const getParcelGeometry = async (parcelID) => {
    return fetch("http://206.12.92.18:10190/parcel/" + parcelID)
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
      return error;
    })
}