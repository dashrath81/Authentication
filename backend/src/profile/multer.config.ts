import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads/profile',

    filename: (req, file, callback) => {

      const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1e9);

      callback(
        null,
        uniqueName + extname(file.originalname),
      );
    },
  }),
};