import StarBorderFrame from '@/components/StarBorderFrame';

/**
 * Bingkai grid dashboard — preset StarBorder + radius layout grid.
 */
export default function DashboardStarBorderFrame({ children }) {
    return (
        <StarBorderFrame
            className="rounded-lg"
            innerClassName="rounded-[7px] bg-white ring-1 ring-inset ring-black/20"
        >
            {children}
        </StarBorderFrame>
    );
}
