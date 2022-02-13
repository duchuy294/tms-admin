import { GroupServicer } from './group-servicer.model';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { TeamServicerPage } from '../team-servicer/team-servicer.model';

export class GroupServicerDetail extends GroupServicer {
    servicerTeams?: PagingModel<TeamServicerPage> = new PagingModel<
        TeamServicerPage
    >();

    constructor(item = null) {
        super();
        this.mapFields(item);

        this.initData();
    }

    public omitFields() {
        return super.omitFields().concat(['servicerTeams']);
    }

    private initData() {
        const servicersRawData = this.servicerTeams.data
            ? this.servicerTeams.data
            : [];
        this.servicerTeams.data = [];
        servicersRawData.forEach(item => {
            this.servicerTeams.data.push(new TeamServicerPage(item));
        });
    }
}
