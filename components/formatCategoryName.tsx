const formatCategoryName = (categoryKey: string) => {
  switch (categoryKey) {
    case 'cottonblend':
      return 'Cotton Blend';
    case 'hundredpercentcotton':
      return '100% Cotton';
    case 'candles':
      return 'Candles';
    case 'storagebox':
      return 'Storage Box';
    case 'diykit':
      return 'D.I.Y. Kit';
    case 'honey':
      return 'Honey';
    case 'honeysticks':
      return 'Honey Dippers';
    case 'solution':
      return 'Solution';
    case 'keychain':
      return 'Key-Chain';
    case 'xmasbox':
      return 'X-Mas Box';
    default:
      return categoryKey.replace(/_/g, ' ');
  }
};

export default formatCategoryName;
