/* SPDX-License-Identifier: Apache 2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
package org.odpi.openmetadata.accessservices.digitalarchitecture.converters;

import org.odpi.openmetadata.accessservices.digitalarchitecture.metadataelements.ReferenceValueAssignmentItemElement;
import org.odpi.openmetadata.accessservices.digitalarchitecture.metadataelements.ReferenceableElement;
import org.odpi.openmetadata.frameworks.connectors.ffdc.PropertyServerException;
import org.odpi.openmetadata.repositoryservices.connectors.stores.metadatacollectionstore.properties.instances.EntityDetail;
import org.odpi.openmetadata.repositoryservices.connectors.stores.metadatacollectionstore.properties.instances.InstanceProperties;
import org.odpi.openmetadata.repositoryservices.connectors.stores.metadatacollectionstore.properties.instances.Relationship;
import org.odpi.openmetadata.repositoryservices.connectors.stores.metadatacollectionstore.properties.typedefs.TypeDefCategory;
import org.odpi.openmetadata.repositoryservices.connectors.stores.metadatacollectionstore.repositoryconnector.OMRSRepositoryHelper;


/**
 * ReferenceValueAssignmentItemConverter provides common methods for transferring relevant properties from an Open Metadata Repository Services (OMRS)
 * Relationship and linked EntityDetail object into a bean that inherits from ReferenceValueAssignmentItemElement.
 */
public class ReferenceValueAssignmentItemConverter<B> extends DigitalArchitectureOMASConverter<B>
{
    /**
     * Constructor
     *
     * @param repositoryHelper helper object to parse entity
     * @param serviceName name of this component
     * @param serverName local server name
     */
    public ReferenceValueAssignmentItemConverter(OMRSRepositoryHelper repositoryHelper,
                                                 String serviceName,
                                                 String serverName)
    {
        super(repositoryHelper, serviceName, serverName);
    }


    /**
     * Using the supplied instances, return a new instance of the bean. This is used for beans that have
     * contain a combination of the properties from an entity and a that os a connected relationship.
     *
     * @param beanClass name of the class to create
     * @param entity entity containing the properties
     * @param relationship relationship containing the properties
     * @param methodName calling method
     * @return bean populated with properties from the instances supplied
     * @throws PropertyServerException there is a problem instantiating the bean
     */
    public B getNewBean(Class<B>     beanClass,
                        EntityDetail entity,
                        Relationship relationship,
                        String       methodName) throws PropertyServerException
    {
        try
        {
            /*
             * This is initial confirmation that the generic converter has been initialized with an appropriate bean class.
             */
            B returnBean = beanClass.newInstance();

            if (returnBean instanceof ReferenceValueAssignmentItemElement)
            {
                ReferenceValueAssignmentItemElement bean         = (ReferenceValueAssignmentItemElement) returnBean;
                ReferenceableElement                assignedItem = new ReferenceableElement();

                if (entity != null)
                {
                    assignedItem.setElementHeader(this.getMetadataElementHeader(beanClass, entity, methodName));

                    /*
                     * The initial set of values come from the entity.
                     */
                    InstanceProperties instanceProperties = new InstanceProperties(entity.getProperties());

                    assignedItem.setQualifiedName(this.removeQualifiedName(instanceProperties));
                    assignedItem.setAdditionalProperties(this.removeAdditionalProperties(instanceProperties));

                    /*
                     * Any remaining properties are returned in the extended properties.  They are
                     * assumed to be defined in a subtype.
                     */
                    assignedItem.setTypeName(assignedItem.getElementHeader().getType().getTypeName());
                    assignedItem.setExtendedProperties(this.getRemainingExtendedProperties(instanceProperties));

                    bean.setAssignedItem(assignedItem);

                    if (relationship != null)
                    {
                        instanceProperties = relationship.getProperties();

                        bean.setConfidence(this.getConfidence(instanceProperties));
                        bean.setSteward(this.getSteward(instanceProperties));
                        bean.setNotes(this.getNotes(instanceProperties));
                    }
                    else
                    {
                        handleMissingMetadataInstance(beanClass.getName(), TypeDefCategory.RELATIONSHIP_DEF, methodName);
                    }
                }
            }

            return returnBean;
        }
        catch (IllegalAccessException | InstantiationException | ClassCastException error)
        {
            super.handleInvalidBeanClass(beanClass.getName(), error, methodName);
        }

        return null;
    }
}
