import { Modal, Text, Stack, Group, Button, Loader } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import { reportIdAtom, stepAtom, trialIdAtom } from "../atoms";
import useRecommendations from "./useRecommendations";
import { VideoPlayer } from "./VideoPlayer";
import classes from "./VideoRecommendation.module.css";

export const VideoRecommendationModal = ({ opened, onClose }) => {
  const reportId = useAtomValue(reportIdAtom);
  const trialId = useAtomValue(trialIdAtom);
  const navigate = useNavigate();
  const setStep = useSetAtom(stepAtom);

  const recommendations = useRecommendations(reportId || trialId);
  const recommendationData = recommendations.data || { videos: [] };

  if (recommendations.isFetching) {
    return <Loader />;
  }

  if (recommendations.isError) {
    throw new Error("recommendations fetch error");
  }

  const randomVideo =
    recommendationData.videos[
      Math.floor(Math.random() * recommendationData.videos.length)
    ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={984}
      closeButtonProps={{
        size: "xl",
      }}
      classNames={{
        body: classes.body,
        content: classes.content,
      }}
    >
      <Stack gap={48} align="center" px={64}>
        <Text fz="4xl" ta="center" lh={1.2}>
          Nice work completing the scan. We’ve made a short video that might be
          helpful for where you’re at.
        </Text>
        <Stack align="center" justify="center" w="100%">
          {recommendations.isFetching ? (
            <Loader />
          ) : (
            <VideoPlayer showMetadata={false} video={randomVideo} />
          )}
        </Stack>

        <Group gap={32}>
          <Button
            onClick={() => {
              navigate("/booth");
              setStep("dashboard");
              onClose();
            }}
            variant="subtle"
            size="xl"
          >
            Back to Dashboard
          </Button>
          {/* <Button
            onClick={() => {
              navigate("/resources");
            }}
            variant="subtle"
            size="xl"
          >
            Go to Resources
          </Button> */}
        </Group>
      </Stack>
    </Modal>
  );
};
