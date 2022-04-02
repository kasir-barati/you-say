import { join } from 'path';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function multerConfigGenerator(): {
    multerConfigs: MulterOptions;
} {
    return {
        multerConfigs: {
            dest: join(process.cwd(), 'static-files'),
            storage: diskStorage({
                destination: join(process.cwd(), 'static-files'),
                filename: function (req, file, callback) {
                    callback(
                        null,
                        `${new Date().getTime()}-${
                            file.originalname
                        }`,
                    );
                },
            }),
        },
    };
}
