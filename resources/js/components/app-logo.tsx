import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 hidden text-left text-sm md:grid">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    StrangeDomains
                </span>
            </div>
        </div>
    );
}
