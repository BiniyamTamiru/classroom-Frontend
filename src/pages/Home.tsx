import { useGetIdentity, useList, useOne } from "@refinedev/core";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";

import {
    CatalogSection,
    ClassesSection,
    CommunitySection,
    FeaturesSection,
    FinalCtaSection,
    HeroSection,
    HomeFooter,
    HowItWorksSection,
    StatsSection,
    type ClassPreview,
    type DepartmentPreview,
    type PlatformStats,
    type SubjectPreview,
} from "@/components/home/home-sections";
import {
    HomeNavigation,
    type HomeIdentity,
} from "@/components/home/home-navigation";

export default function Home() {
    const { data: identity } = useGetIdentity<HomeIdentity>();
    const isAuthenticated = Boolean(identity);

    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

    const classesQuery = useList<ClassPreview>({
        resource: "home/classes",
        pagination: { currentPage: 1, pageSize: 3 },
    });
    const subjectsQuery = useList<SubjectPreview>({
        resource: "home/subjects",
        pagination: { currentPage: 1, pageSize: 4 },
    });
    const departmentsQuery = useList<DepartmentPreview>({
        resource: "home/departments",
        pagination: { currentPage: 1, pageSize: 4 },
    });
    const statsQuery = useOne<PlatformStats>({
        resource: "home/stats",
        id: "summary",
        queryOptions: { enabled: isAuthenticated },
    });

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
                <motion.div
                    style={{ scaleX: progress }}
                    className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-primary via-violet-500 to-emerald-500"
                    aria-hidden="true"
                />
                <HomeNavigation identity={identity} />
                <main>
                    <HeroSection isAuthenticated={isAuthenticated} role={identity?.role} />
                    <FeaturesSection />
                    <HowItWorksSection />
                    <StatsSection
                        isAuthenticated={isAuthenticated}
                        isLoading={isAuthenticated && statsQuery.query.isLoading}
                        isError={isAuthenticated && statsQuery.query.isError}
                        stats={statsQuery.result}
                        onRetry={() => void statsQuery.query.refetch()}
                    />
                    <ClassesSection
                        classes={classesQuery.result.data}
                        isLoading={classesQuery.query.isLoading}
                        isError={classesQuery.query.isError}
                        onRetry={() => void classesQuery.query.refetch()}
                        isAuthenticated={isAuthenticated}
                    />
                    <CatalogSection
                        subjects={subjectsQuery.result.data}
                        departments={departmentsQuery.result.data}
                        subjectsLoading={subjectsQuery.query.isLoading}
                        departmentsLoading={departmentsQuery.query.isLoading}
                        subjectsError={subjectsQuery.query.isError}
                        departmentsError={departmentsQuery.query.isError}
                        retrySubjects={() => void subjectsQuery.query.refetch()}
                        retryDepartments={() => void departmentsQuery.query.refetch()}
                        isAuthenticated={isAuthenticated}
                    />
                    <CommunitySection />
                    <FinalCtaSection isAuthenticated={isAuthenticated} />
                </main>
                <HomeFooter />
            </div>
        </MotionConfig>
    );
}