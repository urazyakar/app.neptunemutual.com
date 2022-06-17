import { OutlinedCard } from "@/common/OutlinedCard/OutlinedCard";
import { IncidentReporter } from "@/src/modules/reporting/IncidentReporter";
import { InsightsTable } from "@/src/modules/reporting/InsightsTable";
import { UnstakeYourAmount } from "@/src/modules/reporting/resolved/UnstakeYourAmount";
import { Divider } from "@/common/Divider/Divider";
import { convertFromUnits, isGreater, toBN } from "@/utils/bn";
import { truncateAddressParam } from "@/utils/address";
import { useFinalizeIncident } from "@/src/hooks/useFinalizeIncident";
import { formatCurrency } from "@/utils/formatter/currency";
import DateLib from "@/lib/date/DateLib";
import { VotesSummaryHorizontalChart } from "@/src/modules/reporting/VotesSummaryHorizontalChart";
import { formatPercent } from "@/utils/formatter/percent";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useCapitalizePool } from "@/src/hooks/useCapitalizePool";
import { useAppConstants } from "@/src/context/AppConstants";

export const ResolvedReportSummary = ({ incidentReport, refetchReport }) => {
  const { finalize, finalizing } = useFinalizeIncident({
    coverKey: incidentReport.key,
    incidentDate: incidentReport.incidentDate,
  });
  const { capitalize, capitalizing } = useCapitalizePool({
    coverKey: incidentReport.key,
    incidentDate: incidentReport.incidentDate,
  });
  const router = useRouter();
  const { NPMTokenSymbol } = useAppConstants();

  const votes = {
    yes: convertFromUnits(incidentReport.totalAttestedStake)
      .decimalPlaces(0)
      .toNumber(),
    no: convertFromUnits(incidentReport.totalRefutedStake)
      .decimalPlaces(0)
      .toNumber(),
  };

  const yesPercent = toBN(votes.yes / (votes.yes + votes.no))
    .decimalPlaces(2)
    .toNumber();
  const noPercent = toBN(1 - yesPercent)
    .decimalPlaces(2)
    .toNumber();

  let isAttestedWon = incidentReport.decision;

  if (incidentReport.decision === null) {
    isAttestedWon = isGreater(
      incidentReport.totalAttestedStake,
      incidentReport.totalRefutedStake
    );
  }

  const majority = {
    voteCount: isAttestedWon
      ? incidentReport.totalAttestedCount
      : incidentReport.totalRefutedCount,
    stake: isAttestedWon ? votes.yes : votes.no,
    percent: isAttestedWon ? yesPercent : noPercent,
    variant: isAttestedWon ? "success" : "failure",
  };

  return (
    <>
      <OutlinedCard className="bg-white md:flex">
        {/* Left half */}
        <div className="flex-1 p-10 md:border-r border-B0C4DB">
          <h2 className="mb-6 font-bold text-h3 font-sora">
            <Trans>Report Summary</Trans>
          </h2>

          <VotesSummaryHorizontalChart
            yesPercent={yesPercent}
            noPercent={noPercent}
            showTooltip={incidentReport.resolved}
            majority={majority}
          />
          <Divider />

          <UnstakeYourAmount incidentReport={incidentReport} />
        </div>

        {/* Right half */}
        <div className="p-10">
          <h3 className="mb-4 font-bold text-h4 font-sora">
            <Trans>Insights</Trans>
          </h3>
          <InsightsTable
            insights={[
              {
                title: t`Incident Occurred`,
                value: formatPercent(yesPercent, router.locale),
                variant: "success",
              },
              {
                title: t`User Votes:`,
                value: incidentReport.totalAttestedCount,
              },
              {
                title: t`Stake:`,
                value: formatCurrency(
                  convertFromUnits(incidentReport.totalAttestedStake),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).short,
              },
            ]}
          />

          <hr className="mt-4 mb-6 border-t border-d4dfee" />
          <InsightsTable
            insights={[
              {
                title: t`False Reporting`,
                value: formatPercent(noPercent, router.locale),
                variant: "error",
              },
              {
                title: t`User Votes:`,
                value: incidentReport.totalRefutedCount,
              },
              {
                title: t`Stake:`,
                value: formatCurrency(
                  convertFromUnits(incidentReport.totalRefutedStake),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).short,
              },
            ]}
          />

          <hr className="mt-6 mb-6 border-t border-d4dfee" />
          <h3 className="mb-4 font-bold text-h4 font-sora">
            <Trans>Incident Reporters</Trans>
          </h3>
          <IncidentReporter
            variant={"success"}
            account={truncateAddressParam(incidentReport.reporter, 8, -6)}
            txHash={incidentReport.reportTransaction.id}
          />
          {incidentReport.disputer && (
            <IncidentReporter
              variant={"error"}
              account={truncateAddressParam(incidentReport.disputer, 8, -6)}
              txHash={incidentReport.disputeTransaction.id}
            />
          )}

          <hr className="mt-8 mb-6 border-t border-d4dfee" />
          <h3 className="mb-4 font-bold text-h4 font-sora">
            <Trans>Reporting Period</Trans>
          </h3>
          <p className="mb-4 text-sm opacity-50">
            <span
              title={DateLib.toLongDateFormat(
                incidentReport.incidentDate,
                router.locale
              )}
            >
              {DateLib.toDateFormat(
                incidentReport.incidentDate,
                router.locale,
                { month: "short", day: "numeric" },
                "UTC"
              )}
            </span>
            {" - "}
            <span
              title={DateLib.toLongDateFormat(
                incidentReport.resolutionTimestamp,
                router.locale
              )}
            >
              {DateLib.toDateFormat(
                incidentReport.resolutionTimestamp,
                router.locale,
                { month: "short", day: "numeric" },
                "UTC"
              )}
            </span>
          </p>

          {!incidentReport.finalized && (
            <>
              <button
                className="text-sm text-4e7dd9"
                disabled={finalizing}
                onClick={async () => {
                  await finalize();
                  setTimeout(refetchReport, 15000);
                }}
              >
                {finalizing ? t`Finalizing...` : t`Finalize`}
              </button>

              <br />

              <button
                className="mt-2 text-sm font-poppins text-4e7dd9"
                disabled={capitalizing}
                onClick={async () => {
                  await capitalize();
                  setTimeout(refetchReport, 15000);
                }}
              >
                {capitalizing ? t`Capitalizing...` : t`Capitalize`}
              </button>
            </>
          )}
        </div>

        <></>
      </OutlinedCard>
    </>
  );
};
