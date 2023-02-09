import { CommonModule } from "@angular/common";
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { NgModule } from "@angular/core";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from "@angular/router";

import { AgentStatusComponent } from "./agent-status/agent-status.component";
import { NewAgentComponent } from "./new-agent/new-agent.component";
import { ShowAgentsComponent } from "./show-agents/show-agents.component";
import { AgentsRoutingModule } from "./agents-routing.module";
import { PipesModule } from "../shared/pipes.module";
import { ComponentsModule } from "../shared/components.module";
import { EditAgentComponent } from './edit-agent/edit-agent.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "../shared/directives.module";

@NgModule({
  declarations:[
    AgentStatusComponent,
    NewAgentComponent,
    ShowAgentsComponent,
    EditAgentComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    DataTablesModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AgentsRoutingModule,
    PipesModule,
    DirectivesModule,
    ComponentsModule
  ]
})
export class AgentsModule {}
