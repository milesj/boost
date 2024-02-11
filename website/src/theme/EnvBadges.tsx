import Link from '@docusaurus/Link';
// @ts-expect-error Not typed
import IconExternalLink from '@theme/Icon/ExternalLink';
import Badge from './Badge';
import BadgeGroup from './BadgeGroup';
import styles from './styles.module.css';

export interface EnvBadgesProps {
	api?: string;
	backend?: boolean;
	frontend?: boolean;
	tooling?: boolean;
}

export default function EnvBadges({ api, backend, frontend, tooling }: EnvBadgesProps) {
	return (
		<>
			{api && (
				<Link className={styles.apiLink} to={api}>
					API <IconExternalLink />
				</Link>
			)}

			<BadgeGroup>
				{backend && <Badge type="warning">Backend</Badge>}

				{frontend && <Badge type="success">Frontend</Badge>}

				{tooling && <Badge type="primary">Tooling</Badge>}
			</BadgeGroup>
		</>
	);
}
