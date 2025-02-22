import {HelpCircleIcon} from '@sanity/icons'
import {Box, Button, Flex, Menu, MenuButton, Text, Tooltip} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import {useColorScheme} from '../../../colorScheme'
import {useGetHelpResources} from './helper-functions/hooks'
import {ResourcesMenuItems} from './ResourcesMenuItems'

const StyledMenu = styled(Menu)`
  max-width: 300px;
  min-width: 200px;
`

export function ResourcesButton() {
  const {scheme} = useColorScheme()

  const {value, error, isLoading} = useGetHelpResources()

  return (
    <Flex>
      <Tooltip
        content={
          <Box padding={2}>
            <Text size={1}>Help and resources </Text>
          </Box>
        }
        scheme={scheme}
        placement="bottom"
        portal
      >
        <div>
          <MenuButton
            button={
              <Button
                aria-label="Help and resources"
                icon={HelpCircleIcon}
                mode="bleed"
                fontSize={2}
              />
            }
            id="menu-button-resources"
            menu={
              <StyledMenu>
                <ResourcesMenuItems error={error} isLoading={isLoading} value={value} />
              </StyledMenu>
            }
            popover={{constrainSize: true, placement: 'bottom', portal: true, scheme}}
          />
        </div>
      </Tooltip>
    </Flex>
  )
}
