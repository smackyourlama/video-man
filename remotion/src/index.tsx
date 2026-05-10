import { registerRoot, getInputProps } from "remotion";
import { Composition } from "remotion";
import { DocumentaryVideo } from "./components/DocumentaryVideo";

export const RemotionVideo = () => {
    const inputProps = getInputProps() as any;
    const dynamicDuration = inputProps?.videoData?.totalDurationSeconds 
        ? Math.round(inputProps.videoData.totalDurationSeconds * 30) 
        : 13500;

    return (
        <>
            <Composition
                id="Documentary"
                component={DocumentaryVideo}
                durationInFrames={dynamicDuration}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    videoData: null
                }}
            />
        </>
    );
};

registerRoot(RemotionVideo);