import { useNavigate } from "react-router-dom";
import SubmissionReview from "@/components/SubmissionReview";

const ReviewSubmissions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <h1 className="text-xl font-bold text-primary-foreground">Review Submissions</h1>
        <p className="text-sm text-primary-foreground/70 mt-1">Approve or reject proof from task workers</p>
      </div>
      <div className="px-5 mt-5">
        <SubmissionReview />
      </div>
    </div>
  );
};

export default ReviewSubmissions;
