import { Cloudinary } from '@cloudinary/url-gen';
import { CLOUDINARY_CLOUD_NAME } from "@/components/constant";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality, dpr } from "@cloudinary/url-gen/actions/delivery";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";

const cld = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_CLOUD_NAME as string
    }
});

export const bannerPhoto = (imageCldpubId: string, name: string) => {
    return cld
        .image(imageCldpubId)
        .resize(fill())
        .delivery(format('auto'))
        .delivery(quality('auto'))
        .delivery(dpr('auto'))
        .overlay(
            source(
                text(name, new TextStyle('Roboto', 20).fontWeight('bold'))
                    .textColor('white')
            )
                .position(
                    new Position()
                        .gravity(compass('west'))
                        .offsetX(0.05)
                )
        )
        .toURL(); // <--- CRITICAL: This turns the config into a usable string URL
};